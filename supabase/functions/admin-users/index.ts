import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) return json({ error: 'Não autenticado.' }, 401)

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
        const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: { user }, error: userError } = await userClient.auth.getUser()
        if (userError || !user) return json({ error: 'Sessão inválida.' }, 401)

        const { data: perfil, error: perfilError } = await userClient
            .from('usuarios')
            .select('perfil_acesso')
            .eq('id', user.id)
            .single()

        if (perfilError || perfil?.perfil_acesso !== 'Administrador') {
            return json({ error: 'Apenas administradores podem executar esta ação.' }, 403)
        }

        const admin = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        const body = await req.json().catch(() => ({}))
        const { action } = body

        if (action === 'get-email') {
            const { userId } = body
            if (!userId) return json({ error: 'userId obrigatório.' }, 400)
            const { data, error } = await admin.auth.admin.getUserById(userId)
            if (error) return json({ error: error.message }, 400)
            return json({ email: data.user?.email ?? null })
        }

        if (action === 'create') {
            const { email, password } = body
            if (!email || !password) {
                return json({ error: 'email e password obrigatórios.' }, 400)
            }
            const { data, error } = await admin.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            })
            if (error) return json({ error: error.message }, 400)
            return json({ userId: data.user.id })
        }

        if (action === 'update-password') {
            const { userId, password } = body
            if (!userId || !password) {
                return json({ error: 'userId e password obrigatórios.' }, 400)
            }
            if (password.length < 6) {
                return json({ error: 'A senha deve ter ao menos 6 caracteres.' }, 400)
            }
            const { error } = await admin.auth.admin.updateUserById(userId, { password })
            if (error) return json({ error: error.message }, 400)
            return json({ ok: true })
        }

        return json({ error: 'Ação desconhecida.' }, 400)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro inesperado.'
        return json({ error: message }, 500)
    }
})
