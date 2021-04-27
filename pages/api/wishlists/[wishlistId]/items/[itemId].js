import _ from 'lodash'
import { client, q } from '../../../../../util/db.js'

export default (req, res) => {
  if (req.method === 'PATCH') {
    const { wishlistId, itemId } = req.query
    return client
      .query(
        q.Update(q.Ref(q.Collection('wishlists'), wishlistId), {
          data: {
            list: {
              items: {
                [itemId]: req.body,
              },
            },
          },
        })
      )
      .then((result) => {
        res.status(200).json(result.data)
      })
  } else if (req.method === 'DELETE') {
    const { wishlistId, itemId } = req.query
    return client
      .query(
        q.Update(q.Ref(q.Collection('wishlists'), wishlistId), {
          data: {
            list: {
              items: {
                [itemId]: null,
              },
            },
          },
        })
      )
      .then((result) => {
        res.status(204).json()
      })
  } else {
    res.status(404).json({ message: 'Not found' })
  }
}
