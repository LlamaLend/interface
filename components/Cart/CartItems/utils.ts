export const formatErrorMsg = (error: any) => {
	if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
		return 'Cannot estimate gas, Transaction may fail or may require manual gas limit.'
	} else return error.reason
}
