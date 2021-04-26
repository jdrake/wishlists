import { client, q } from '../../../util/db.js'

export default (req, res) => {
  const { id } = req.query
  return client.query(q.Get(q.Ref(q.Collection('wishlists'), id))).then((result) => {
    console.log(result)
    res.status(200).json(result.data)
  })
}
