import { createElement, render } from '@wordpress/element'
import VersionMismatchNotice from './notifications/VersionMismatchNotice'
import $ from 'jquery'

export const mount = (el) => {
	if (el.querySelector('.notice-blocksy-theme-version-mismatch')) {
		render(
			<VersionMismatchNotice
				updatesUrl={
					el.querySelector('.notice-blocksy-theme-version-mismatch')
						.dataset.url
				}
			/>,
			el.querySelector('.notice-blocksy-theme-version-mismatch')
		)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	mount(document.body)
})
