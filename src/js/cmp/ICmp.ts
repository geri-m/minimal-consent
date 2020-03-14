import CMP from "./CMP"

export default interface ICmp {
    _cmp: CMP,
    name: string;

    handleCmp(): void;
}