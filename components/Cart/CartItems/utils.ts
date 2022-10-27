export const formatErrorMsg = (error: any) => {
	if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
		return 'Cannot estimate gas, transaction may fail or may require manual gas limit.'
	}

	if (error.startsWith('insufficient funds')) {
		return 'Insufficient funds, transaction may fail.'
	}

	return error.reason
}
