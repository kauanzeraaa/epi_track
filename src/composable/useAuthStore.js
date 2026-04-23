import { ref } from 'vue'
import { useSupabase } from './useSupabase'

// Variáveis globais para armazenar o estado de autenticação
const currentUser = ref(null)
const userProfile = ref(null)
const isAuthLoading = ref(false)

// Função para gerenciar o estado de autenticação do usuário e buscar seu perfil
export function useAuthStore() {
    const { supabase } = useSupabase()

    const fetchUserProfile = async () => {
        isAuthLoading.value = true

        try{
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (user){
                currentUser.value = user

                const { data, error: userError } = await supabase
                    .from('vw_usuarios_completos')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                    if (userError){
                        console.log('Erro ao buscar perfil do usuário:', userError.message)
                        userProfile.value = null
                    }else{
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
        isAuthLoading.value = false
    }

    return {
        currentUser,
        userProfile,
        isAuthLoading,
        fetchUserProfile,
        clearAuth
    }
}