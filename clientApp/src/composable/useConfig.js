import { get } from 'lodash';

const hostLocal = process.env.NODE_ENV === 'production' ? 'https://erp.zealtechpos.com/api' : 'http://127.0.0.1:8000/api';
const hostNameLocal = process.env.NODE_ENV === 'production' ? 'https://erp.zealtechpos.com' : 'http://127.0.0.1:8000';
export const host = hostLocal;
export const hostName = hostNameLocal;
export default function useConfig() {
    return {
        host: hostLocal,
        hostName: hostNameLocal,
        get
    }
}