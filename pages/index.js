import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

import styles from './wishlists.module.css'
import Nav from '../components/nav.js'
import { fetcher } from '../util/fetcher.js'
import classNames from 'classnames'

function WishLists({ user }) {
  const { data, error: apiError } = useSWR('/api/wishlists', fetcher)

  if (apiError) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  console.log(data)
  return (
    <>
      <Head>
        <title>Wishlists</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className="section">
        <div className="container">
          {data.wishlists.map((wishlist, i) => {
            return (
              <div className="wishlist-tile tile is-3" key={i}>
                <Link href={`/wishlists/${wishlist.id}`}>
                  <div className={classNames(['card', styles.wishlistCard])}>
                    <div className="card-content">
                      <div className="media">
                        <div className="media-left">
                          <figure className="image is-48x48">
                            <img
                              src="https://bulma.io/images/placeholders/96x96.png"
                              alt="Placeholder image"
                            />
                          </figure>
                        </div>
                        <div className="media-content">
                          <p className="title is-4">{wishlist.data.name}</p>
                        </div>
                      </div>

                      <div className="content">
                        <p>{wishlist.data.description}</p>
                        <p>Created by: {wishlist.data.createdBy.name}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(WishLists)
