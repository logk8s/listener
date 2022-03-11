# LogK8S - Listener

## Research

[Decode Kubernetes secret](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/)

[Kubernetes secret](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)

## Run

For security access setup do this:
[stackoverflow](https://stackoverflow.com/questions/49173838/deployments-apps-is-forbidden-user-systemserviceaccountdefaultdefault-cann)

```bash
#WARNING: This allows any user with read access to secrets or the ability to create a pod to access super-user credentials.

kubectl create clusterrolebinding serviceaccounts-cluster-admin \
  --clusterrole=cluster-admin \
  --group=system:serviceaccounts
```

Run using kubectl:

```bash
kubectl run -it --rm listener --image=logk8s/listener:1.0 -- sh
/usr/src/app> node dist/main
```
