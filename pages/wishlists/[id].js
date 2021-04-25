import Head from 'next/head'
import { useRouter } from 'next/router'

import styles from '../../styles/Home.module.css'
import Nav from '../../components/nav.js'

function Wishlist() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className="container">
      <Head>
        <title>Wishlists - {id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className="section">
        <h1 className="title">Wishlists - {id}</h1>
      </div>
    </div>
  )
}

export default Wishlist
