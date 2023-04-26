import React from 'react'
import classes from './footer.module.css'
function Footer(props) {
	return (
		<div className={`${props.className} ${classes.Footer}`}>
			<a href="https://github.com/gauravxor/indian-tourism/tree/master" target='blank'>Check project details</a>
		</div>
	)
}

export default Footer