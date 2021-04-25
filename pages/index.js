import Head from 'next/head'
import useSWR from 'swr'

import styles from '../styles/Home.module.css'
import Nav from '../components/nav.js'
import { fetcher } from '../util/fetcher.js'

function WishLists() {
  const { data, error } = useSWR('/api/wishlists', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

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
                <div className="card">
                  {/* <div className="card-image">
                    <figure className="image is-4by3">
                      <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
                    </figure>
                  </div> */}
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
                        <p className="subtitle is-6">@johnsmith</p>
                      </div>
                    </div>

                    <div className="content">{wishlist.data.description}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default WishLists
