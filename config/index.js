const secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret';
export default secret;
