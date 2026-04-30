import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CadastroFuncionarioView from '../views/CadastroFuncionarioView.vue'

describe('CadastroFuncionarioView', () => {
    it('deve mostrar erro quando o nome não for preenchido', async () => {
        const wrapper = mount(CadastroFuncionarioView)

        await wrapper.find('form').trigger('submit')
        expect(wrapper.text()).toContain('O nome do funcionário é obrigatório.')
    })
})