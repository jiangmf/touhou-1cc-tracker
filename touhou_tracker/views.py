from django.http import Http404, HttpResponse
from django.shortcuts import render, redirect, reverse
from touhou_tracker.models import Track, Colors

from django.views.generic.edit import CreateView
import json, os
from collections import OrderedDict

def index_view(request):
    return render(request, 'home.html')

def goto_tracker(request):
    if request.method == 'POST':
        try:
            track = Track.objects.get(track_id=request.POST['track_id'])
            return redirect('edit_tracker', track_id=track.track_id)
        except:
            return redirect('home')
    return redirect('home')

def new_tracker(request):
    track = Track.objects.create(
        password='',
        colors=Colors.objects.create()
    )
    request.session['new_tracker'] = True
    return redirect('edit_tracker', track_id=track.track_id)

#     if request.method == 'POST':
#         track = Track.objects.create(
#             password=request.POST['tracker_password']
#         )
#         return redirect('edit_tracker', track_id=track.track_id)
#     return render(request, 'new.html')

def edit_tracker(request, track_id=None):
    try:
        track = Track.objects.get(track_id=track_id, read_only=False)
    except Track.DoesNotExist:
        return render(request, 'edit-404.html')
    if request.method == 'POST':
        status_code = 1
        ret = {}
        if request.POST.get('method', '') == 'save':
            if request.POST.get('pass', '') == track.password:
                track.data = request.POST['track_data']
                track.save()
                track_color = track.colors
                for k, v in json.loads(request.POST['color_data']).items():
                    setattr(track_color, k, v)
                track_color.save()
                status_code = 0
            else:
                status_code = 2
        elif request.POST.get('method', '') == 'share':
            new_track = Track.objects.create(read_only=True, data=track.data, colors = track.colors)
            status_code = 0
            ret.update({"share_url": request.build_absolute_uri(reverse('view_tracker', args=(new_track.track_id,)))})
            print(ret)
        ret.update({"status": status_code})
        return HttpResponse(json.dumps(ret), content_type="application/json")
    else:
        if not track.data:
            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)),
                'touhou_tracker/data.json'), 'r') as f:
                data = json.loads(f.read(), object_pairs_hook=OrderedDict)
            track.data = json.dumps(data)
            track.save()
        context = {
            "track_id": track.track_id,
            "data": json.loads(track.data, object_pairs_hook=OrderedDict),
            "read_only": track.read_only,
            "colors" : track.colors.to_dict()
        }
        if request.session.get('new_tracker', False):
            context.update({'new_tracker': True})
            request.session['new_tracker'] = False
        return render(request, 'edit.html', context=context)

def view_tracker(request, track_id=None):
    try:
        track = Track.objects.get(track_id=track_id)
    except Track.DoesNotExist:
        return render(request, 'view-404.html')
    if not track.data:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)),
            'touhou_tracker/data.json'), 'r') as f:
            data = json.loads(f.read(), object_pairs_hook=OrderedDict)
            track.data = json.dumps(data)
            track.save()
    context = {
        "track_id": track.track_id,
        "data": json.loads(track.data, object_pairs_hook=OrderedDict),
        "read_only": track.read_only,
        "colors" : track.colors.to_dict()
    }
    return render(request, 'view.html', context=context)
