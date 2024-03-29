import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faFloppyDisk, faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'

import styles from './index.module.css'

import { menuItemClick, actionItemClick } from '@/slice/menuSlice'

import { MENU_ITEMS } from '@/constants'

const Menu = () => {
    const dispatch = useDispatch()
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    const handleMenuClick = (itemName) => {
        dispatch(menuItemClick(itemName))
    }

    const handleActioItemClick = (itemName) => {
        dispatch(actionItemClick(itemName))
    }
    return (
        <div className={styles.menuContainer}>
            <div className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL })} onClick={() => { handleMenuClick(MENU_ITEMS.PENCIL); handleActioItemClick(MENU_ITEMS.PENCIL) }}>
                <FontAwesomeIcon icon={faPencil} className={styles.icon} />
            </div>
            <div className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.ERASER })} onClick={() => { handleMenuClick(MENU_ITEMS.ERASER); handleActioItemClick(MENU_ITEMS.ERASER) }}>
                <FontAwesomeIcon icon={faEraser} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper} onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}>
                <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper} onClick={() => handleActioItemClick(MENU_ITEMS.SAVE)}>
                <FontAwesomeIcon icon={faFloppyDisk} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper} onClick={() => handleActioItemClick(MENU_ITEMS.HOME)}>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
            </div>
        </div>
    )
}

export default Menu;