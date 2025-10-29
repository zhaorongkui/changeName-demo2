/*
 * @Description:
 */
import type { FactoryItem, FactoryQueryParams, RegionDetail } from '@/types/waterFactory';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

// 获取水厂列表
export function getFactoryList(params: { currPage: number; pageSize: number; params: FactoryQueryParams }) {
    return request.post<PageResult<FactoryItem>>('/base/info/factory/page', params);
}

export function getRegionList(parentCode = '0') {
    return request.get<RegionDetail[]>(`/iot/settings/info/region/query`, { parentCode });
}

export function fileUpload(files: File[]) {
    if (files.find((item) => item.size / 1024 / 1024 > 10)) {
        ElMessage.warning('文件大小不得超过10M');
        return;
    }
    return request.post('/iot/settings/info/file/upload', { files }, null, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('id_token')}`,
        },
    });
}
