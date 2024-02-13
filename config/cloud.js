import multer from 'multer';
import cloudinary from 'cloudinary';


const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: 'dwgwcghfh',
  api_key: '752441957739682',
  api_secret: '61RSi1rXXIepEk99-Q8qlXl-Ees',
});
