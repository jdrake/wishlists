import { useState } from 'react'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useUser } from '@auth0/nextjs-auth0'
import 'react-quill/dist/quill.snow.css'
import _ from 'lodash'
import parseHtml from 'html-react-parser'

import Nav from '../../components/nav.js'
import { fetcher } from '../../util/fetcher.js'
import styles from './wishlist.module.css'
import { random } from '../../util/id.js'

const Quill = dynamic(import('react-quill'), {
  ssr: false,
  // loading: () => <Spin />,
})

function WishlistItem({ wishlist, item, editable }) {
  const [isReserving, setReserving] = useState(false)
  const [isDeleting, setDeleting] = useState(false)

  function onReserve() {
    setReserving(true)
    mutate(`/api/wishlists/${wishlist.id}`, async () => {
      await fetch(`/api/wishlists/${wishlist.id}/items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reserved: true }),
      })
      setReserving(false)
      return {
        ...wishlist,
        list: {
          ...wishlist.list,
          items: { ...wishlist.list.items, [item.id]: { ...item, reserved: true } },
        },
      }
    })
  }

  function onDelete() {
    setDeleting(true)
    mutate(`/api/wishlists/${wishlist.id}`, async () => {
      await fetch(`/api/wishlists/${wishlist.id}/items/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setDeleting(false)
      return {
        ...wishlist,
        list: { items: _.reject(wishlist.list.items, { id: item.id }) },
      }
    })
  }

  return (
    <div className="box">
      <article className="media">
        {/* <div className="media-left">
          <figure className="image is-64x64">
            <img
              className="is-rounded"
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="Image"
            />
          </figure>
        </div> */}
        <div className="media-content">
          <div className="content">
            <div className="block">
              <strong>{item.title}</strong>
              <br />
              <span>{parseHtml(item.description)}</span>
            </div>
          </div>
        </div>
        <div className="media-right">
          <div className="field is-grouped">
            <p className="control">
              <button
                onClick={() => onReserve()}
                className={classnames('button', {
                  'is-primary': !item.reserved,
                  'is-loading': isReserving,
                })}
                disabled={item.reserved}
              >
                {item.reserved ? 'Reserved 🎁' : 'Reserve'}
              </button>
            </p>
            {editable && (
              <p className="control">
                <button
                  onClick={() => onDelete()}
                  className={classnames('button is-danger is-light', {
                    'is-loading': isDeleting,
                  })}
                >
                  Delete
                </button>
              </p>
            )}
          </div>
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
      const newItem = { id: random(), title, description }
      await fetch(`/api/wishlists/${wishlist.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      setSaving(false)
      toggleModal(false)
      return {
        ...wishlist,
        list: { items: { ...wishlist.list.items, [newItem.id]: newItem } },
      }
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
                onClick={() => {
                  setSaving(false)
                  toggleModal(false)
                }}
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

  const editable = wishlist.createdBy.sub === user.sub

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
              <div className={classnames(['block', styles.imageHeader])}>
                <figure className={classnames(['image', 'is-128x128'])}>
                  <Image
                    src={wishlist.image.src}
                    alt={wishlist.name}
                    layout="fill"
                    className="is-rounded"
                  />
                </figure>
              </div>
              <h1 className={classnames(['title', 'is-1', styles.center])}>
                {wishlist.name}
              </h1>
              <div className="block">
                <h3 className={classnames(['title', 'is-6', styles.center])}>
                  Created with ❤️ &nbsp;by {wishlist.createdBy.name}
                </h3>
              </div>
              <div className="block">{wishlist.description}</div>
              <div className="wishlist-items block">
                {Object.values(wishlist.list.items).map(function renderItem(item, i) {
                  return (
                    <WishlistItem
                      wishlist={wishlist}
                      item={item}
                      editable={editable}
                      key={i}
                    />
                  )
                })}
              </div>
              {editable ? (
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
