import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import classnames from 'classnames'

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
                            <Image
                              src={wishlist.data.image.src}
                              alt={wishlist.data.name}
                              layout="fill"
                              className="is-rounded"
                            />
                          </figure>
                        </div>
                        <div className="media-content">
                          <p className="title is-4">{wishlist.data.name}</p>
                        </div>
                      </div>
                      <div className="block">
                        <p>{wishlist.data.description}</p>
                      </div>
                      <div className={classnames(['block', styles.participants])}>
                        <figure className={classnames(['image', 'is-24x24'])}>
                          <Image
                            src={wishlist.data.createdBy.picture}
                            alt={wishlist.data.createdBy.name}
                            layout="fill"
                            className="is-rounded"
                          />
                        </figure>
                        <span className="has-text-grey-light">and 12 wish granters</span>
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
