import fs from 'fs';
import path from 'path';


const uploadsDir = path.join("programming", 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
