FROM harbor.hcytech.dev/base/nginx


RUN rm /etc/nginx/conf.d/default.conf

ADD default.conf /etc/nginx/conf.d/

COPY main_dist/ /usr/share/nginx/html/
