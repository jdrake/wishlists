import { client, q } from '../../../../util/db.js'

export default (req, res) => {
  const { wishlistId } = req.query
  return client
    .query(q.Get(q.Ref(q.Collection('wishlists'), wishlistId)))
    .then((result) => {
      result.data.id = result.ref.id
      res.status(200).json(result.data)
    })
}
