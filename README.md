# Lemaitre

Upload Galaxy Tools to your installation.

```
docker run -p 80:8000  \ 
  -v /srv/galaxy/server/tools/custom:/srv/galaxy/server/tools/custom \
  reproducible-bioinformatics/lemaitre:latest
```
