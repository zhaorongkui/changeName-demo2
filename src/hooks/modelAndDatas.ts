import { ref } from "vue";
const detailsData = ref({
    updateUser: '',
    updateTime: '',
    imgUrl: '',
    id: '',
    name: '',
    license: '',
    langueName: '',
    langueCode: '',
    frameName: '',
    frameCode: '',
    tagType: {
        id: 0,
        tags: []
    },
    platformName: '',
    platformCode: '',
    hardwareName: '',
    hardwareCode: '',
    serverConfigName: '',
    serverConfigCode: '',
    distributedSupport: -1,
    detail: '',
    integral: '-'
})
export default function commonDetailsFn () {
    const setDetailsDataFn = (data: {}) => {
        Object.keys(detailsData.value).forEach(key => {
            if (key === 'tagType') {
                Object.keys(detailsData.value[key]).forEach(newKey => {
                    detailsData.value[key][newKey] = data[key][newKey]
                })
            } else {
                detailsData.value[key] = data[key]
            }
        })
    }
    return {
        detailsData,
        setDetailsDataFn,
    }
} 