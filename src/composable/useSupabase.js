import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    })
    : null

const session = ref(null)
const loadingSession = ref(true)

supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    loadingSession.value = false
})

supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
})

export function useSupabase() {
    return {
        supabase,
        supabaseAdmin,
        session,
        loadingSession
    }
}
