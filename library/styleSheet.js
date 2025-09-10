//
// Copyright (c) 2022-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import styles from "./styles.css?raw"

export const styleSheet = new CSSStyleSheet()
export default styleSheet

styleSheet.replaceSync(styles)
