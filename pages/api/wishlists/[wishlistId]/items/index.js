import _ from 'lodash'
import { client, q } from '../../../../../util/db.js'

export default (req, res) => {
  const { wishlistId } = req.query
  const newItem = req.body
  return client
    .query(
      q.Update(q.Ref(q.Collection('wishlists'), wishlistId), {
        data: {
          list: {
            items: {
              [newItem.id]: newItem,
            },
          },
        },
      })
    )
    .then((result) => {
      console.log(result)
      res.status(200).json(result.data)
    })
}
