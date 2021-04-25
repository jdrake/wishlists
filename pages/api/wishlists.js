import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })

export default (req, res) => {
  return client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('wishlists')), { size: 100 }),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    )
    .then((result) => {
      console.log(result)
      res.status(200).json({ wishlists: result.data })
    })
}
