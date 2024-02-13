import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
import News from '../models/News.js';


export const create_news = asyncHandler(async (req, res, next) => {
	try{
		const {
			image,
			title,
			body,
		} = req.body
		console.log(image)
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
					console.log(error);
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

		const news = await News.create({
			image: public_id,
			title,
			body,
		})

		if (news) {
			res.status(201).json({
				message: 'news has been posted successfully',
				status: 'ok',
				data: news,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const get_all_news = asyncHandler(async(req, res, next) => {
	try{
		// const { page, pageSize } = req.query;
		// const news = await News.find({})
		// .skip((page - 1) * pageSize)
		// .limit(pageSize);
		// const totalNews = await News.countDocuments();
		// const totalPages = Math.ceil(totalNews / pageSize);

		
		const news = await News.find({})
		const reversedNews = news.reverse();

		const { page, pageSize } = req.query;
		const startIdx = (page - 1) * pageSize;
		const paginatedNews = reversedNews.slice(startIdx, startIdx + pageSize);
		const totalNews = await News.countDocuments();
		const totalPages = Math.ceil(totalNews / pageSize);

		const startIdx2 = (0) * 5;
		const paginatedNews2 = reversedNews.slice(startIdx2, startIdx2 + 5);
		
		res.json({
			status: "ok",
			message: "all news retrieved",
			data: {
				// news,
				// totalNews,
				// currentPage: Number(page),
				// totalPages,
				paginatedNews2,
				paginatedNews,
				totalNews,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error);
	}
})

export const admin_search_news = asyncHandler(async (req, res, next) => {
	try{
		const pipeline = [
			{
			$match: {},
			}
		];
		
		const results = await News.aggregate(pipeline);
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