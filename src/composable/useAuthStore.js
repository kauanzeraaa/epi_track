import { ref } from 'vue'
import { useSupabase } from './useSupabase'

// Variáveis globais para armazenar o estado de autenticação
const currentUser = ref(null)
const userProfile = ref(null)
const isAuthenticated = ref(false)

// Função para gerenciar o estado de autenticação do usuário e buscar seu perfil
export function useAuthStore() {
    const { supabase } = useSupabase()

    const fetchUserProfile = async () => {
        isAuthLoading.value = true

        try{
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (user){
                currentUser.value = user

                const { data, error } = await supabase
                    .from('vw_usuarios_completos')
                    .select('nome', 'perfil_acesso', 'foto_perfil')
                    .eq('id', user.id)
                    .single()
                
                    if (data){
                        userProfile.value = data
                    }
            }else{
                clearAuth()
            }
        } catch (error){
            console.error('Erro ao buscar perfil do usuário:', error)
        }finally{
            isAuthLoading.value = false
        }
    }

    const clearAuth = () => {
        currentUser.value = null
        userProfile.value = null
        isAuthenticated.value = false
    }

    return {
        currentUser,
        userProfile,
        isAuthenticated,
        fetchUserProfile,
        clearAuth
    }
}