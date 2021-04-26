import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'

import styles from '../styles/nav.module.css'

function Nav() {
  const { user, error, isLoading } = useUser()
  console.log(user)
  // user.picture = null
  return (
    <nav
      className={classnames(['navbar', styles.navbar])}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item">
            <Image src="/logo.svg" width="28" height="28" alt="Wishlists" />
          </a>
        </Link>
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link href="/">
            <a className="navbar-item">Wishlists</a>
          </Link>
        </div>

        {user && (
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                <figure
                  className={classnames(['image', 'is-28x28', styles.userPicture])}
                >
                  {user.picture ? (
                    <img className="is-rounded" src={user.picture} />
                  ) : (
                    <Image className="is-rounded" src="/face.svg" layout="fill" />
                  )}
                </figure>
              </a>

              <div className="navbar-dropdown is-right">
                <div className="navbar-item">
                  <strong>{user.name}</strong>
                </div>
                <hr className="navbar-divider" />
                <Link href="/api/auth/logout">
                  <a className="navbar-item">Log out</a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Nav
