export class Product {
    private _id: number;
    private _name: string;
    private _image: string;
    private _price: string;
    private _quantity: number;

    constructor(id?: number, name?: string, image?: string, price?: string, quantity?: number) {
        this._id = id;
        this._name = name;
        this._image = image;
        this._price = price;
        this._quantity = quantity;
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

    get image(): string {
        return this._image;
    }

    set image(image: string) {
        this._image = image;
    }

    get price(): string {
        return this._price;
    }

    set price(price: string) {
        this._price = price;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(quantity: number) {
        this._quantity = quantity;
    }

    validate() {
        let valid = true;

        for (let i in this) {
            if (!this[i]) {
                console.log(i);
                console.log(this[i]);

                valid = false;
            }
        }

        console.log(valid);

        return valid;
    }
}
