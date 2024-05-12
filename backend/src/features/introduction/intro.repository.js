import { ObjectId } from "mongodb";
import { getDb } from "../../../config/mongodb.js";

export default class IntroRepository {
	constructor() {
		this.collection = "Introduction"
	}


	async getAll() {
		try {
			const db = getDb();
			const collection = db.collection(this.collection);

			// Fetch all documents from the collection
			const data = await collection.find({}).toArray();
			return data;
		} catch (error) {
			console.error('Error fetching all data:', error);
			throw error;
		}
	}

	async add(newContent) {
		try {
			const db = getDb();
			const collection = db.collection(this.collection);
			await collection.insertOne(newContent);
			return newContent;

		} catch (error) {
			console.log(error);
			return "Something went wrong in products database while adding content"
		}
		
	}

	async update(name, age, place, imageUrl, id) {
		try {
			const db = getDb();
			const collection = db.collection(this.collection);

			const result = await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { name: name, age: age, place: place, imageUrl: imageUrl } }
			);

			if (result.modifiedCount === 0) {
				throw new Error('No document found to update');
			}

			return "Document updated successfully";

		} catch (error) {
			console.error(error);
			throw new Error("Something went wrong in products database while updating content");
		}
	}

}