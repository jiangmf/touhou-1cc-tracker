# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-19 19:05
from __future__ import unicode_literals

from django.db import migrations, models
import touhou_tracker.models


class Migration(migrations.Migration):

    dependencies = [
        ('touhou_tracker', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='track',
            name='track_id',
            field=models.CharField(default=touhou_tracker.models.my_random_key, max_length=10),
        ),
    ]
