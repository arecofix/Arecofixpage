import { createElement } from '@wordpress/element'
import { __ } from 'ct-i18n'

import {
	BaseControl,
	Flex,
	FlexItem,
	__experimentalNumberControl as NumberControl,
	RangeControl as NativeRangeControl,
} from '@wordpress/components'

const RangeControl = ({ label, onChange, initialPosition, value }) => {
	return (
		<fieldset>
			<BaseControl.VisualLabel as="legend">
				{label}
			</BaseControl.VisualLabel>
			<Flex gap={4}>
				<FlexItem isBlock>
					<NumberControl
						size="__unstable-large"
						onChange={onChange}
						value={value}
						min={1}
						label={label}
						hideLabelFromVision
					/>
				</FlexItem>
				<FlexItem isBlock>
					<NativeRangeControl
						value={parseInt(value, 10)} // RangeControl can't deal with strings.
						onChange={onChange}
						min={1}
						max={6}
						withInputField={false}
						label={label}
						hideLabelFromVision
					/>
				</FlexItem>
			</Flex>
		</fieldset>
	)
}

export default RangeControl
