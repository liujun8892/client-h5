const state = {
    gift: JSON.parse(localStorage.getItem(`gift`))  || {}, // 选中的99礼包
    
};
const mutations = {
    //保存选中的礼物
    SAVE_GIFT(state, gift) {
        localStorage.setItem(`gift`,gift)
        state.gift = gift;
    }
};

const actions = {
    saveGift({
        commit
    }, gift) {
        commit("SAVE_GIFT", gift)
    }
    
};
const getters = {

};

// 不要忘记把state, mutations等暴露出去。
export default {
    state,
    mutations,
    actions,
    getters
}