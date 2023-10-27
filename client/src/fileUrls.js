const imageUrls = {
    "gaurav": "https://i.imgur.com/l38nwER.jpg",
    "kaushal": "https://i.imgur.com/o1JsaOu.jpg",
    "rohit": "https://i.imgur.com/SFA0BAl.jpg",
    "siteLogo": "https://i.imgur.com/SkhnYws.png",
    "defaultUserLogo": "https://i.imgur.com/Dhu42vq.png"
}
export default imageUrls;

/** Using named exports to provide convinence when we want to use single file */
const siteLogo = imageUrls.siteLogo;
const defaultUserLogo = imageUrls.defaultUserLogo;

export {
    siteLogo,
    defaultUserLogo
};