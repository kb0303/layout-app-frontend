import IntroModel from "./intro.model.js";
import IntroRepository from "./intro.repository.js";

export default class IntroController {
	constructor() {
		this.introRepository = new IntroRepository()
	}

	async getAll(req, res) {
		try {
			// Fetch all data from the repository
			const data = await this.introRepository.getAll();
			res.json(data);
		} catch (error) {
			console.error('Error fetching all data:', error);
			res.status(500).send('Internal server error');
		}
	}

	async add(req, res) {
		try {
			const { name, age, place } = req.body;
			const imageUrl = req.file.filename

			// creating new content instance
			const newContent = new IntroModel(name, age, place, imageUrl)

			// adding content in the database
			await this.introRepository.add(newContent);
			res.status(201).send(newContent);

		} catch (error) {
			res.status(500).send("Something went wrong in database")
		}
	}

	async update(req, res) {
		try {
			const { name, age, place } = req.body;
			const imageUrl = req.file.filename
			const id = req.params.id;

			const updatedContent = await this.introRepository.update(name, age, place, imageUrl, id);

			if (!updatedContent) {
				return res.status(404).send('Content not found');
			}

			res.json(updatedContent);
		} catch (error) {
			console.error(error);
			res.status(500).send('Something went wrong in database');
		}
	}
}