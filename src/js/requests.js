export const getNewQuestions = async () => {
    const res = await axios.post('https://opentdb.com/api.php?amount=10')
    //TODO: check for response code and throw alert
    return res.data.results
}