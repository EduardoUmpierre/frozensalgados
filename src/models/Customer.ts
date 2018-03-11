export class Customer {
    private _id: number;
    private _name: string;
    private _phone: string;
    private _address: string;
    private _city: string;
    private _cep: string;
    private _district: string;

    constructor(id?: number, name?: string, phone?: string, address?: string, city?: string, cep?: string, district?: string) {
        this._id = id;
        this._name = name;
        this._phone = phone;
        this._address = address;
        this._city = city;
        this._cep = cep;
        this._district = district;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get phone(): string {
        return this._phone;
    }

    set phone(phone: string) {
        this._phone = phone;
    }

    get address(): string {
        return this._address;
    }

    set address(address: string) {
        this._address = address;
    }

    get city(): string {
        return this._city;
    }

    set city(city: string) {
        this._city = city;
    }

    get cep(): string {
        return this._cep;
    }

    set cep(cep: string) {
        this._cep = cep;
    }

    get district(): string {
        return this._district;
    }

    set district(district: string) {
        this._district = district;
    }
}
