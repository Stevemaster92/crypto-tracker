import { firestore } from "firebase-admin";

export default class FirestoreService<T> {
    private collection: firestore.CollectionReference;
    private db: firestore.Firestore;

    constructor(collection: string) {
        this.db = firestore();
        this.collection = this.db.collection(collection);
    }

    public async get(id: string) {
        const snapshot = await this.collection.doc(id).get();

        return snapshot.data();
    }

    public async getAll() {
        const snapshot = await this.collection.get();

        return snapshot.docs;
    }

    public async create(doc: T, id?: string) {
        if (id) {
            const ref = this.collection.doc(id);
            await ref.create(doc);

            return ref;
        }

        return this.collection.add(doc);
    }

    public update(id: string, doc: T) {
        return this.collection.doc(id).update(doc);
    }

    public remove(id: string) {
        return this.collection.doc(id).delete();
    }
}
