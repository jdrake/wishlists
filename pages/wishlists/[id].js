import { useState } from 'react'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useUser } from '@auth0/nextjs-auth0'
import 'react-quill/dist/quill.snow.css'
import _ from 'lodash'

import Nav from '../../components/nav.js'
import { fetcher } from '../../util/fetcher.js'
import styles from './wishlist.module.css'

const Quill = dynamic(import('react-quill'), {
  ssr: false,
  // loading: () => <Spin />,
})

function WishlistItem({ item }) {
  return (
    <div className="box">
      <article className="media">
        <div className="media-left">
          <figure className="image is-64x64">
            <img
              className="is-rounded"
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="Image"
            />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{item.title}</strong>
              <br />
              {item.description}
            </p>
          </div>
        </div>
        <div className="media-right">
          <button
            className={classnames({
              button: true,
              'is-primary': !item.reserved,
            })}
            disabled={item.reserved}
          >
            {item.reserved ? 'Reserved 🎁' : 'Reserve'}
          </button>
        </div>
      </article>
    </div>
  )
}

function NewItemModal({ wishlist, isOpen, toggleModal }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setSaving] = useState(false)

  function onSubmit() {
    setSaving(true)
    mutate(`/api/wishlists/${wishlist.id}`, async () => {
      const newItem = { id: _.uniqueId('item'), title, description }
      await fetch(`/api/wishlists/${wishlist.id}/items`, {
        method: 'POST',
        body: JSON.stringify({ wishlist, newItem }),
      })
      return { ...wishlist, list: { items: { ...wishlist.list.items, newItem } } }
    })
  }

  return (
    <div
      id="newItemModal"
      className={classnames({
        modal: true,
        'is-active': isOpen,
      })}
    >
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="New pair of socks"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <Quill theme="snow" value={description} onChange={setDescription} />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className={classnames({
                  button: true,
                  'is-primary': true,
                  'is-loading': isSaving,
                })}
                onClick={onSubmit}
              >
                Create
              </button>
            </div>
            <div className="control">
              <button
                className="button is-link is-light"
                onClick={() => toggleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

function Wishlist() {
  const [modalOpen, toggleModal] = useState(0)

  const { user, error, isLoading } = useUser()

  const router = useRouter()
  const { id } = router.query

  const { data: wishlist, error: apiError } = useSWR(`/api/wishlists/${id}`, fetcher)

  if (apiError) return <div>failed to load</div>
  if (!wishlist) return <div>loading...</div>
  console.log(wishlist)

  return (
    <>
      <Head>
        <title>Wishlists - {wishlist.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-half is-offset-one-quarter">
              <h1 className={classnames(['title', 'is-1', styles.title])}>
                {wishlist.name}
              </h1>
              <div className="block">
                <h3 className={classnames(['title', 'is-6', styles.title])}>
                  Created with ❤️ by {wishlist.createdBy.name}
                </h3>
              </div>
              <div className="block">{wishlist.description}</div>
              <div className="wishlist-items block">
                {Object.values(wishlist.list.items).map(function renderItem(item, i) {
                  return <WishlistItem item={item} key={i} />
                })}
              </div>
              {wishlist.createdBy.sub === user.sub ? (
                <>
                  <div className="block center">
                    <button
                      className="button is-primary modal-button"
                      onClick={() => toggleModal(!modalOpen)}
                    >
                      Add Item
                    </button>
                  </div>
                  <NewItemModal
                    wishlist={wishlist}
                    isOpen={modalOpen}
                    toggleModal={toggleModal}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(Wishlist)
