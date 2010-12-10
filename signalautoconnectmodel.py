from django.db import models
try:
    import idmapper.models
except:
    idmapper = None

# Only post_save and pre_save signals are handled as of today
def autoconnect(cls):
    if not hasattr(cls, 'Meta') or not getattr(cls.Meta, 'abstract', False):
        for signame in ("pre_save", "post_save"):
            if hasattr(cls, 'on_'+signame):
                getattr(models.signals, signame).connect(getattr(cls, 'on_'+signame), sender=cls)

class SignalAutoConnectModel(models.Model):
    class __metaclass__(models.Model.__metaclass__):
        def __init__(cls, *arg, **kw):
            models.Model.__metaclass__.__init__(cls, *arg, **kw)
            autoconnect(cls)
    class Meta:
        abstract = True


if idmapper is not None:
    class SharedMemorySignalAutoConnectModel(idmapper.models.SharedMemoryModel):
        class __metaclass__(idmapper.models.SharedMemoryModel.__metaclass__):
            def __init__(cls, *arg, **kw):
                idmapper.models.SharedMemoryModel.__metaclass__.__init__(cls, *arg, **kw)
                autoconnect(cls)
        class Meta:
            abstract = True

