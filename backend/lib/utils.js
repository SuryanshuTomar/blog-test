// Models
const Tag = require("../models/Tag.model");

async function findOrCreateTag(tagName) {
	try {
		const existingTag = await Tag.findOne({
			name: tagName.toLowerCase(),
		}).exec();

		if (existingTag) {
			return {
				tagId: existingTag._id,
				tagName: existingTag.name,
			};
		} else {
			const newTag = new Tag({ name: tagName.toLowerCase() });
			const savedTag = await newTag.save();
			return {
				tagId: savedTag._id,
				tagName: savedTag.name,
			};
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

module.exports = { findOrCreateTag };
