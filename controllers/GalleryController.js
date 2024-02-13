import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
import Gallery from '../models/Gallery.js';


export const create_gallery = asyncHandler(async (req, res, next) => {
	try{
		const {
			image,
			title,
		} = req.body

		const uploadImageToCloudinary = (image) => {
			return new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				image,
				{
				upload_preset: "unsigned_upload2",
				allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
				},
				(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
				}
			);
			});
		};
		
		const uploadedImage = await uploadImageToCloudinary(image);
		
		const public_id = uploadedImage.public_id

		const gallery = await Gallery.create({
			image: public_id,
			title,
		})

		if (gallery) {
			res.status(201).json({
				message: 'image uploaded successfully',
				status: 'ok',
				data: gallery,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const get_all_images = asyncHandler(async(req, res, next) => {
	try{
		const gallery = await Gallery.find({})
		const reversedGallery = gallery.reverse();

		const { page, pageSize } = req.query;
		const startIdx = (page - 1) * pageSize;
		const paginatedGallery = reversedGallery.slice(startIdx, startIdx + pageSize);
		const totalImages = await Gallery.countDocuments();
		const totalPages = Math.ceil(totalImages / pageSize);

		const startIdx2 = (0) * 5;
		const paginatedGallery2 = reversedGallery.slice(startIdx2, startIdx2 + 5);
		
		res.json({
			status: "ok",
			message: "all images retrieved",
			data: {
				paginatedGallery2,
				paginatedGallery,
				totalImages,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error);
	}
})

export const admin_search_gallery = asyncHandler(async (req, res, next) => {
	try{
		const pipeline = [
			{
			$match: {},
			}
		];
		
		const results = await Gallery.aggregate(pipeline);
		if (results) {
			res.status(201).json({
				message: 'search result',
				status: 'ok',
				data: results,
			})
		} else {
			throw new Error('search does not exist')
		}
	} catch (error) {
		next(error);
	}
})