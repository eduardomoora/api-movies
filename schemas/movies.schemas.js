const z  = require("zod");

const movieSchema = z.object({
    title: z.string(),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url(),
    genre: z.enum(['Drama','Comedy','Fantasy','Horror','Sci-fi','Adventure','Action','Thriller']).array(),
    rate: z.number().positive(),
})


function validateMovie(movie){
    return movieSchema.safeParse(movie);
}

function validatePartialMovie(input){
    return movieSchema.partial().safeParse(input);
}

module.exports = { validateMovie, validatePartialMovie }