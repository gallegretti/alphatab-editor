export class TypeConversions {
    static uint16ToInt16(v) {
        TypeConversions._dataView.setUint16(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int16ToUint32(v) {
        TypeConversions._dataView.setInt16(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static int32ToUint16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint16(0, true);
    }
    static int32ToInt16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int32ToUint32(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static uint8ToInt8(v) {
        TypeConversions._dataView.setUint8(0, v);
        return TypeConversions._dataView.getInt8(0);
    }
}
TypeConversions._conversionBuffer = new ArrayBuffer(8);
TypeConversions._dataView = new DataView(TypeConversions._conversionBuffer);
//# sourceMappingURL=TypeConversions.js.map