import { client, q } from '../../../util/db.js'

export default (req, res) => {
  return client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('wishlists')), { size: 100 }),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    )
    .then((result) => {
      result.data.forEach((wishlist) => {
        wishlist.id = wishlist.ref.id
      })
      res.status(200).json({ wishlists: result.data })
    })
}
