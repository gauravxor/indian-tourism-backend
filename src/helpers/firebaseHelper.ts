import admin from "firebase-admin";
import fireBaseConfig from "@config/firebase";

admin.initializeApp({
    credential: admin.credential.cert(fireBaseConfig),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const uploadImage = async (
    fileBuffer: Buffer,
    directory: string,
    folderName: string | null,
    oldFileName: string | null,
    newFileName: string,
    mimeType: string
): Promise<string | void> => {
    try {
        const bucket = admin.storage().bucket();
        if (oldFileName !== null) {
            const oldFilePath = `${directory}/${folderName}/${oldFileName}`;
            const oldFile = bucket.file(oldFilePath);
            const [fileExists] = await oldFile.exists();
            if (fileExists) {
                await oldFile.delete();
            }
        }
        const newFilePath = folderName
            ? `${directory}/${folderName}/${newFileName}`
            : `${directory}/${newFileName}`;

        const newFile = bucket.file(newFilePath);

        await newFile.save(fileBuffer, {
            metadata: {
                contentType: mimeType,
            },
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFile.name}`;
        return publicUrl;
    } catch (error) {
        console.log("Error uploading file to Firebase Storage:", error);
    }
};

export default uploadImage;
