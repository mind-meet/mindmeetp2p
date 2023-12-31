// controll state os audios and video

import { reactive, toRefs } from 'vue'

const state = reactive({
    isAudioOn: false,
    isVideoOn: false,
})

export default function useMediaControll() {

    const setVideoOn = (value) => {
        state.isVideoOn = value
    }

    const setAudioOn = (value) => {
        state.isAudioOn = value
    }

    return {
        ...toRefs(state),
        setVideoOn,
        setAudioOn,
    }
}
