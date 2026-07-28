export const deploymentAssetRecoveryKey = 'petrivan:deployment-asset-recovery';

export function clearDeploymentAssetRecovery() {
	try {
		sessionStorage.removeItem(deploymentAssetRecoveryKey);
	} catch {
		// Session storage can be unavailable in privacy-restricted browsing modes.
	}
}
