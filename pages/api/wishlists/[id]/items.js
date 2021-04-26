import _ from 'lodash'
import { client, q } from '../../../../util/db.js'

export default (req, res) => {
  const { wishlist, newItem } = req.query
  const items = {}
  items[_.uniqueId('item')] = newItem
  return client
    .query(
      q.Update(q.Ref(q.Collection('wishlists'), wishlist.id), {
        data: {
          list: {
            items,
          },
        },
      })
    )
    .then((result) => {
      console.log(result)
      res.status(200).json(result.data)
    })
}
